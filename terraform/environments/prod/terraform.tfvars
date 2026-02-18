aws_region         = "us-east-1"
environment        = "prod"
project_name       = "ttp"
vpc_cidr           = "10.0.0.0/16"
availability_zones = ["us-east-1a", "us-east-1b", "us-east-1c"]

# EKS Configuration
eks_cluster_version      = "1.28"
eks_node_instance_types  = ["t3.large", "t3.xlarge"]
eks_node_desired_size    = 3
eks_node_min_size        = 2
eks_node_max_size        = 10

# RDS Configuration
rds_instance_class    = "db.r6g.xlarge"
rds_allocated_storage = 100
rds_multi_az          = true

# Redis Configuration
redis_node_type       = "cache.r6g.large"
redis_num_cache_nodes = 3

# Domain
domain_name = "ttp.example.com"
